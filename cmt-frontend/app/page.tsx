import ContentCard from './components/content-card'
import ContentMetadataCard from './components/content-metadata-card'
import UserMetadataCard from './components/user-metadata-card'

export default function ContentReview() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1">
        <ContentCard
          contentType="image"
          text="This is a test"
          imgUrl="https://picsum.photos/300/300"
        ></ContentCard>
        <ContentMetadataCard
          id="1"
          createTime="2023-05-29"
        ></ContentMetadataCard>
      </div>
      <div className="col-span-1">
        <UserMetadataCard
          id="10"
          name="John Doe"
          email="johndoe@email.com"
          phoneNumber="555-555-5555"
        ></UserMetadataCard>
      </div>
      <div className="col-span-1">
      </div>
    </div>
  )
}
