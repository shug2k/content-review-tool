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
        <div className="w-96 h-96 bg-white shadow rounded-lg mt-5">
          <div className="flex w-96 h-14 bg-blue-900 rounded-md items-center justify-center">
            <h1 className="text-2xl text-white text-center">User Info</h1>
          </div>
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