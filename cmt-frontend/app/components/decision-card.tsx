import { FC } from 'react';

type DecisionCardProps = {
    decisionTree?: string;
}

/*
<p className="Isthis violating? w-80 h-10 text-3xl">Is this violating?</p>
<div className="Ellipse1 w-4 h-4 bg-gray-900 rounded-full"/>
<p className="Yes w-10 h-10 text-2xl">Yes</p>
<p className="No w-10 h-10 text-2xl">No</p>
<div className="Ellipse2 w-4 h-4 bg-white border rounded-full border-black"/>

<div class="w-24 h-11 bg-yellow-600 rounded-lg"/>
<p class="text-xl font-bold text-white">Submit</p>
<div class="w-24 h-11 bg-white border rounded-lg border-black"/>
<p class="text-xl font-bold text-center">Back</p>
*/

const DecisionCard: FC<DecisionCardProps> = ({decisionTree}) => {
    return (
        <div className="w-96 h-96 bg-white shadow rounded-lg mt-5 relative">
          <div className="flex w-96 h-14 bg-blue-900 rounded-md items-center justify-center">
            <h1 className="text-2xl text-white text-center">Decision</h1>
          </div>
          <div>
            <h1 className="w-80 h-10 text-xl mx-2">Is this violating?</h1>
            <input className = "mx-4" type="radio" value="Yes"/>Yes<br></br>
            <input className = "mx-4" type="radio" value="No"/>No
          </div>
          <div className="absolute bottom-0 right-0">
            <div className="flex w-24 h-11 bg-white border rounded-lg border-black items-center justify-center float-left mx-2 my-4">
              <p className="text-xl font-bold text-center">Back</p>
            </div>
            <div className="flex w-24 h-11 bg-orange-600 rounded-lg items-center justify-center float-right mx-2 my-4">
              <p className="text-xl font-bold text-white">Submit</p>
            </div>
          </div>
        </div>
    );
}

export default DecisionCard;