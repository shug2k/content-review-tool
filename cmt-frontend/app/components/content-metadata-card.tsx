import { FC } from 'react';

type ContentMetadataCardProps = {
    id?: string;
    createTime?: string;
    additionalInfo?: string;
}

const ContentMetadataCard: FC<ContentMetadataCardProps> = ({id, createTime, additionalInfo}) => {
    return (
        <div className="w-full h-96 bg-gray-200 rounded-md shadow-md items-center">
          <h1 className="text-center">Content Info</h1>
          <table className="border-separate border-spacing-4 table-fixed w-full mx-auto">
            <tbody>
            {id && 
              <tr>
                <td>ID</td>
                <td>{id}</td>
              </tr>
            }
            {createTime && 
              <tr>
                <td>Creation Time</td>
                <td>{createTime}</td>
              </tr>
            }
            {additionalInfo && 
              <tr>
                <td>Additional Information</td>
                <td>{additionalInfo}</td>
              </tr>
            }
            </tbody>
          </table>
        </div>
    );
}

export default ContentMetadataCard;