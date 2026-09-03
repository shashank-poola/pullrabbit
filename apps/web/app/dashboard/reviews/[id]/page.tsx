import { ReviewDetailScreen } from "@/components/dashboard/ReviewDetailScreen";

export default async function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReviewDetailScreen reviewId={id} />;
}
