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
*/

const DecisionCard: FC<DecisionCardProps> = ({decisionTree}) => {
    return (
        <div className="w-96 h-96 bg-white shadow rounded-lg mt-5">
          <div className="flex w-96 h-14 bg-gray-800 rounded-md items-center justify-center">
            <h1 className="text-2xl text-white text-center">Decision</h1>
          </div>
          <div>
            <h1 className="w-80 h-10 text-3xl">Is this violating?</h1>
            <input type="radio" value="Yes"/>Yes<br></br>
            <input type="radio" value="No"/>No
          </div>
        </div>
    );
}

export default DecisionCard;