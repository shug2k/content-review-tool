import { FC } from 'react';

type ContentCardProps = {
    contentType: string;
    imgUrl?: string;
    text?: string;
}

const ContentCard: FC<ContentCardProps> = ({contentType, imgUrl, text}) => {
    return (
        <div className="w-full h-96 bg-gray-200 rounded-md shadow-md items-center">
        {contentType === 'text' && (
            <p className="text-black text-center">{text}</p>
        )}
        {contentType === 'image' && (
            <img src={imgUrl} alt="Image" className="w-64 h-64 mx-auto"></img>
        )}
        </div>
    );
}

export default ContentCard;