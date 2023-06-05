import ContentCard from './components/content-card'
import ContentMetadataCard from './components/content-metadata-card'
import DecisionCard from './components/decision-card'
import UserMetadataCard from './components/user-metadata-card'

export default function ContentReview() {
  return (
    <div>
      <div className="flex bg-white border border-gray-300 justify-end items-center w-full h-16">
        <p className="w-fit h-7 text-xl font-medium text-gray-500 px-4">
          <a className="mx-2 lg:mx-4 hover:text-black" href="http://www.google.com">All Reviews</a>
          <a className="mx-2 lg:mx-4 hover:text-black" href="http://www.google.com">Previous</a>
          <a className="mx-2 lg:mx-4 hover:text-black" href="http://www.google.com">Next</a>
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:mx-8">
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
          <DecisionCard
          ></DecisionCard>
        </div>
      </div>
    </div>
  )
}
