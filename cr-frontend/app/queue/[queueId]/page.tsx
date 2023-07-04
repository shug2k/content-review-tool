
async function getData(queueId: string) {
  const res = await fetch('http://localhost:8000/queue/' + queueId);
 
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
 
  return res.json();
}

export default async function Reviews({ 
  params: { queueId },
}: {
  params: { queueId: string }
}) {
  const data = await getData(queueId);

  return (
    <div>
      <div className="flex bg-white border border-gray-300 items-center max-sm:justify-center w-full h-16">
        <p className="w-fit h-7 text-xl font-medium text-gray-500 px-4 md:mx-2">
          <span className="mx-3 lg:mx-4 hover:text-black">Reviews</span>
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mx-1 lg:mx-8 py-4">
        <table className="table-fixed w-full mx-auto border">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left font-normal border">ID</th>
              <th className="text-left font-normal border">Type</th>
            </tr>
          </thead>
          <tbody>
            {data.reviews.map((item: {id: number, entity_id: string, entity_type: string}) => {
              return (
                <tr>
                  <td className="text-left font-medium hover:bg-gray-300 border">
                    <a href={"/review/" + item.id}>{item.entity_id}</a>
                  </td>
                  <td className="text-left border">{item.entity_type}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
