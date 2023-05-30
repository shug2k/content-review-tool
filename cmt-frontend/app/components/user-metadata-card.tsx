import { FC } from 'react';

type UserMetadataCardProps = {
    id?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    additionalInfo?: string;
}

const UserMetadataCard: FC<UserMetadataCardProps> = ({id, name, email, phoneNumber, additionalInfo}) => {
    return (
        <div className="w-full h-96 bg-gray-200 rounded-md shadow-md items-center">
          <h1 className="text-center">User Info</h1>
          <table className="border-separate border-spacing-4 table-fixed w-full mx-auto">
            <tbody>
            {id && 
              <tr>
                <td>ID</td>
                <td>{id}</td>
              </tr>
            }
            {name && 
              <tr>
                <td>Name</td>
                <td>{name}</td>
              </tr>
            }
            {email && 
              <tr>
                <td>Email</td>
                <td>{email}</td>
              </tr>
            }
            {phoneNumber && 
              <tr>
                <td>Phone Number</td>
                <td>{phoneNumber}</td>
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

export default UserMetadataCard;