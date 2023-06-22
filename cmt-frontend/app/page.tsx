
async function getData() {
  const res = await fetch('http://localhost:8000/queues');
 
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
 
  return res.json();
}

export default async function Queues() {
  const data = await getData();

  return (
    <div>
      <div className="flex bg-white border border-gray-300 items-center max-sm:justify-center w-full h-16">
        <p className="w-fit h-7 text-xl font-medium text-gray-500 px-4 md:mx-2">
          <span className="mx-3 lg:mx-4 hover:text-black">Queues</span>
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mx-1 lg:mx-8">
        <table className="border-separate border-spacing-4 table-fixed w-full mx-auto">
          <tbody>
            <tr>
              <td className="text-left">Name</td>
              <td className="text-left">Count</td>
            </tr>
            {data.queues.map((item: {name: string, item_count: string}) => {
              {console.log(item)}
              return (
                <tr>
                  <td className="text-left">{item.name}</td>
                  <td className="text-left">{item.item_count}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
