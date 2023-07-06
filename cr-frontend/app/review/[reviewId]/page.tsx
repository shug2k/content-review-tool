/*
Copyright 2023, Sagnik Ghosh

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


import ContentCard from '../components/content-card'
import ContentMetadataCard from '../components/content-metadata-card'
import DecisionCard from '../components/decision-card'
import UserMetadataCard from '../components/user-metadata-card'

async function getData(reviewId: string) {
  const res = await fetch('http://localhost:8000/review/' + reviewId);
 
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
 
  return res.json();
}

export default async function ContentReview({
  params: { reviewId },
}: {
  params: { reviewId: string }
}) {
  const data = await getData(reviewId);

  return (
    <div>
      <div className="flex bg-white border border-gray-300 md:justify-end items-center 
        max-sm:justify-center w-full h-16">
        <p className="w-fit h-7 text-xl font-medium text-gray-500 px-4 md:mx-2">
          <a className="mx-3 lg:mx-4 hover:text-black" href={"/queue/" + data.queue_id}>All Reviews</a>
          <a className="mx-3 lg:mx-4 hover:text-black" href={data.prev_review_id}>Previous</a>
          <a className="mx-3 lg:mx-4 hover:text-black" href={data.next_review_id}>Next</a>
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mx-1 lg:mx-8">
        <div className="col-span-1">
          <ContentCard
            contentType={data.entity_type}
            text={data.entity_content}
            imgUrl={data.entity_content}
          ></ContentCard>
          <ContentMetadataCard
            id={data.entity_id}
            createTime="2023-05-29"
          ></ContentMetadataCard>
        </div>
        <div className="col-span-1">
          <UserMetadataCard
            id={data.user_id}
            name={data.user_name}
            email={data.user_email}
            phoneNumber={data.user_phone_number}
          ></UserMetadataCard>
        </div>
        <div className="col-span-1">
          <DecisionCard
            reviewId={reviewId}
            nextReviewId={data.next_review_id}
            decisionTree={data.decision_tree}
          ></DecisionCard>
        </div>
      </div>
    </div>
  )
}
