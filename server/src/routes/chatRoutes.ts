import express, { Request, Response } from "express";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.post("/conversation", authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { senderId, receiverId, productId } = req.body;

        const existingConversation = await Conversation.findOne({
            members: { $all: [senderId, receiverId] },
            productId: productId,
        });

        console.log(existingConversation);

        if (existingConversation) {
            return res.status(200).json(existingConversation);
        }

        const newConversation = new Conversation({
            members: [senderId, receiverId],
            productId: productId,
        });

        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (error) {
        console.error("채팅방 생성 에러:", error);
        res.status(500).json(error);
    }
});

router.get("/conversations/:userId", authenticate, async (req: Request, res: Response) => {
    try {
        const conversations = await Conversation.find({
            members: { $in: [req.params.userId] },
        }).populate("productId");

        res.status(200).json(conversations);
    } catch (error) {
        console.error("대화방 목록 조회 에러:", error);
        res.status(500).json(error);
    }
});

router.post("/message", authenticate, async (req: Request, res: Response) => {
    const newMessage = new Message(req.body);

    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (error) {
        console.error("메시지 저장 에러:", error);
        res.status(500).json(error);
    }
});

router.get("/messages/:conversationId", authenticate, async (req: Request, res: Response) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    } catch (error) {
        console.error("메시지 내역 조회 에러:", error);
        res.status(500).json(error);
    }
});

router.put("/conversation/:conversationId/leave", authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user?._id.toString();

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return res.status(404).json({ message: "채팅방 없음" });

        // 방 참여자 명단에서 현재 나가는 유저의 ID만 빼온다.
        conversation.members = conversation.members.filter((memberId) => memberId !== userId);

        // 만약 내가 나가서 남은 사람이 0명이 되었다면? -> DB에서 완전 삭제 (폭파)
        if (conversation.members.length === 0) {
            await Conversation.findByIdAndDelete(conversationId);
            await Message.deleteMany({ conversationId });
            return res.status(200).json({ message: "모든 유저가 나가 채팅방과 대화 내역이 완전히 삭제되었습니다." });
        }

        // 아직 상대방이 1명 남아있다면? -> 내 ID만 빠진 상태로 저장 (상대방은 대화 기록 볼 수 있음)
        await conversation.save();
        return res.status(200).json({ message: "채팅방에서 나갔습니다." });
    } catch (error) {
        console.error("채팅방 나가기 에러:", error);
        res.status(500).json(error);
    }
});

export default router;
