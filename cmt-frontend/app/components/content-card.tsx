import { FC } from 'react';

type ContentCardProps = {
    contentType: string;
    imgUrl?: string;
    text?: string;
}
/*
<div className="Rectangle3 w-96 h-96 bg-white shadow rounded-lg"/>
<div className="Rectangle9 w-96 h-14 bg-gray-800 rounded-md"/>
<p className="ContentInfo text-2xl text-white">Content Info</p>
<p className="1 text-base">1</p>
<p className="CreationTime text-base">Creation Time</p>
<p className="2023-05-2910:00 AM text-base">2023-05-29 10:00 AM</p>
*/

const ContentCard: FC<ContentCardProps> = ({contentType, imgUrl, text}) => {
    return (
        <div className="w-96 h-96 bg-white shadow rounded-lg mt-5">
          <div className="flex w-96 h-14 bg-blue-900 rounded-md items-center justify-center">
            <h1 className="text-2xl text-white text-center">Content</h1>
          </div>
          {contentType === 'text' && (
          <p className="text-center">{text}</p>
          )}
          {contentType === 'image' && (
          <img src={imgUrl} alt="Image" className="w-64 h-64 mx-auto"></img>
          )}
        </div>
    );
}

export default ContentCard;