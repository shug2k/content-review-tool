import { FC } from 'react';

type ContentCardProps = {
    contentType: string;
    imgUrl?: string;
    text?: string;
}

const ContentCard: FC<ContentCardProps> = ({contentType, imgUrl, text}) => {
    return (
        <div className="w-96 h-96 bg-white shadow rounded-lg mt-5">
          <div className="flex w-96 h-14 bg-blue-950 rounded-md items-center justify-center">
            <h1 className="text-2xl text-white text-center">Content</h1>
          </div>
          <div className="my-4">
            {contentType === 'text' && (
            <p className="text-center">{text}</p>
            )}
            {contentType === 'image' && (
            <img src={imgUrl} alt="Image" className="w-fit mx-auto"></img>
            )}
          </div>
        </div>
    );
}

export default ContentCard;