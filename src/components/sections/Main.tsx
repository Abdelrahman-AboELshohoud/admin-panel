export default function Main() {
  return (
    <div className=" h-full flex items-stretch gap-5">
      <div className="w-full flex flex-col items-center justify-start gap-5 bg-tertiary py-5 px-8 rounded-2xl">
        <h3 className="text-xl font-semibold text-quaternary">
          Currently in the works
        </h3>
        <div className="font-bold text-5xl">0</div>
        <p>Orders</p>
      </div>
      <div className="w-full flex flex-col items-center justify-start gap-5 bg-tertiary py-5 px-8 rounded-2xl">
        <h3 className="text-xl font-semibold  text-quaternary">
          Currently in the works
        </h3>
        <div className="flex  justify-center gap-4">
          <div className="flex flex-col items-center w-1/2 text-green-500 gap-3">
            <div className="font-bold text-5xl">0</div>
            <p className="text-wrap w-full text-center">Completed and Paid</p>
          </div>
          <div className="flex flex-col items-center w-1/2 text-red-500  gap-3">
            <div className="font-bold text-5xl">0</div>
            <p>Cancelled</p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-start gap-5 bg-tertiary py-5 px-4 rounded-2xl">
        <h3 className="text-xl font-semibold  text-quaternary">Online</h3>
        <div className="flex  justify-between gap-4">
          <div className="flex flex-col items-center  text-quaternary gap-3">
            <div className="font-bold text-5xl">15</div>
            <p className="text-wrap w-full text-center">Performers</p>
          </div>
          <div className="flex flex-col items-center  text-quaternary  gap-3">
            <div className="font-bold text-5xl">0</div>
            <p>Dispatchers</p>
          </div>
          <div className="flex flex-col items-center  text-quaternary  gap-3">
            <div className="font-bold text-5xl">0</div>
            <p>Staff</p>
          </div>
        </div>
      </div>
    </div>
  );
}
