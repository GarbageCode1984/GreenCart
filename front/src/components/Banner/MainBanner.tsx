import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import styled from "styled-components";
import { colors } from "@/constants";

import bannerImage1 from "../../assets/banner/test1.jpg";
import bannerImage2 from "../../assets/banner/test2.jpg";
import bannerImage3 from "../../assets/banner/test3.jpg";

const MainBanner = () => {
    const banners = [
        { id: 1, url: bannerImage1, name: "배너 이미지 1", description: "TEST1", link: "" },
        { id: 2, url: bannerImage2, name: "배너 이미지 2", description: "TEST2", link: "" },
        { id: 3, url: bannerImage3, name: "배너 이미지 3", description: "TEST3", link: "" },
    ];

    return (
        <BannerContainer>
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={true}
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        <ProductSlide>
                            <SlideImage src={banner.url} alt={banner.name} />
                            <ProductInfo>
                                <h2>{banner.name}</h2>
                                <p>{banner.description}</p>
                                <ShopButton to="#">자세히 보기</ShopButton>
                            </ProductInfo>
                        </ProductSlide>
                    </SwiperSlide>
                ))}
            </Swiper>
        </BannerContainer>
    );
};

const BannerContainer = styled.div`
    width: 100%;
    max-width: 1500px;
    margin: 0 auto;
    overflow: hidden;
    position: relative;
`;

const ProductSlide = styled.div`
    width: 100%;
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
    margin-top: 50px;
`;

const SlideImage = styled.img`
    display: block;
    width: 100%;
    height: auto;
    max-height: 70vh;
    object-fit: cover;
`;

const ProductInfo = styled.div`
    position: absolute;
    bottom: 30px;
    left: 30px;
    color: ${colors.WHITE};
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
    max-width: 80%;
    z-index: 10;

    h2 {
        font-size: clamp(1.8rem, 3vw, 3rem);
        margin-bottom: 10px;
    }

    p {
        font-size: clamp(1rem, 1.5vw, 1.5rem);
        margin-bottom: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

const ShopButton = styled(Link)`
    display: inline-block;
    background-color: ${colors.GREEN_100};
    color: ${colors.WHITE};
    padding: 10px 20px;
    border-radius: 5px;
    text-decoration: none;
    font-size: 1.2rem;
    transition: background-color 0.3s;

    &:hover {
        background-color: ${colors.GREEN_200};
    }
`;

export default MainBanner;
