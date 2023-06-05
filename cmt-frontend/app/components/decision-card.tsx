import { FC } from 'react';

type DecisionCardProps = {
    decisionTree?: string;
}

const DecisionCard: FC<DecisionCardProps> = ({decisionTree}) => {
    return (
        <div className="w-96 h-96 bg-white shadow rounded-lg mt-5 relative">
          <div className="flex w-96 h-14 bg-blue-950 rounded-md items-center justify-center">
            <h1 className="text-2xl text-white text-center">Decision</h1>
          </div>
          <div>
            <h1 className="w-80 h-10 text-xl mx-2">Is this violating?</h1>
            <input className = "mx-4" type="radio" name="is-violating" value="Yes"/>Yes<br></br>
            <input className = "mx-4" type="radio" name="is-violating" value="No"/>No
          </div>
          <div className="absolute bottom-0 right-0">
            <button className="flex w-24 h-11 bg-white border rounded-lg 
              border-black items-center justify-center float-left text-xl font-bold mx-2 my-4">
              Back
            </button>
            <button className="flex w-24 h-11 bg-orange-600 rounded-lg
              items-center justify-center float-right text-xl font-bold text-white mx-2 my-4">
              Submit
            </button>
          </div>
        </div>
    );
}

export default DecisionCard;