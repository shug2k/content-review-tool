import { FC } from 'react';

type ContentMetadataCardProps = {
    id?: string;
    createTime?: string;
    additionalInfo?: string;
}

const ContentMetadataCard: FC<ContentMetadataCardProps> = ({id, createTime, additionalInfo}) => {
    return (
        <div className="w-96 h-96 bg-white shadow rounded-lg mt-5">
          <div className="flex w-96 h-14 bg-blue-950 rounded-md items-center justify-center">
            <h1 className="text-2xl text-white text-center">Content Info</h1>
          </div>
          <table className="border-separate border-spacing-4 table-fixed w-full mx-auto">
            <tbody>
            {id && 
              <tr>
                <td className="text-left">ID</td>
                <td className="text-left">{id}</td>
              </tr>
            }
            {createTime && 
              <tr>
                <td className="text-left">Creation Time</td>
                <td className="text-left">{createTime}</td>
              </tr>
            }
            {additionalInfo && 
              <tr>
                <td className="text-left">Additional Information</td>
                <td className="text-left">{additionalInfo}</td>
              </tr>
            }
            </tbody>
          </table>
        </div>
    );
}

export default ContentMetadataCard;