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