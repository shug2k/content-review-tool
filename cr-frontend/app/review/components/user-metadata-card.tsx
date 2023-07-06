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
          <div className="flex w-96 h-14 bg-blue-950 rounded-md items-center justify-center">
            <h1 className="text-2xl text-white text-center">User Info</h1>
          </div>
          <table className="border-separate border-spacing-4 table-fixed w-full mx-auto">
            <tbody>
            {id && 
              <tr>
                <td className="text-left">ID</td>
                <td className="text-left">{id}</td>
              </tr>
            }
            {name && 
              <tr>
                <td className="text-left">Name</td>
                <td className="text-left">{name}</td>
              </tr>
            }
            {email && 
              <tr>
                <td className="text-left">Email</td>
                <td className="text-left">{email}</td>
              </tr>
            }
            {phoneNumber && 
              <tr>
                <td className="text-left">Phone Number</td>
                <td className="text-left">{phoneNumber}</td>
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

export default UserMetadataCard;