import ContentCard from './components/content-card'

export default function ContentReview() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1">
        <ContentCard
          contentType="image"
          text="This is a test"
          imgUrl="https://picsum.photos/300/300"
        ></ContentCard>
      </div>
      <div className="col-span-1">
      </div>
      <div className="col-span-1">
      </div>
    </div>
  )
}
