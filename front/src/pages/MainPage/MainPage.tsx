import Banner from "@/components/Banner/MainBanner";
import CategoryProductSection from "@/components/CategoryProduct/CategoryProductSection";

function MainPage() {
    const categories = [
        { id: "category-a", name: "인기 상품 모음" },
        { id: "category-b", name: "최신 유행 스타일" },
        { id: "category-c", name: "친환경 제품" },
        { id: "category-d", name: "MD 추천 상품" },
    ];

    return (
        <>
            <Banner />
            {categories.map((category) => (
                <CategoryProductSection key={category.id} categoryId={category.id} categoryName={category.name} />
            ))}
        </>
    );
}

export default MainPage;
