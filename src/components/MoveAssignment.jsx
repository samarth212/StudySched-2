import React from 'react';

const MoveAssignment = ({ show, onClose, scheduler, arrayIndex, dayIndex }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-4xl sm:w-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800">Move Assignment</h2>
          <p className="mt-4 text-gray-600">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Inventore sapiente est magnam quas vel at soluta eius atque corrupti aut fugit corporis iste similique, quos minima alias! Quibusdam fugit dolor aspernatur sint alias vitae tenetur? Harum voluptates magnam aspernatur suscipit repudiandae non, distinctio consequuntur error nobis recusandae tempora culpa, unde consectetur natus exercitationem omnis dolore, quas ducimus id fugiat necessitatibus quo nihil impedit. Reprehenderit voluptatibus incidunt vitae, molestiae dignissimos modi laboriosam deleniti illum expedita ipsam id? Culpa, temporibus saepe beatae voluptas sapiente nulla adipisci. Quae quos, beatae similique quibusdam saepe nulla sunt eaque quam tempora doloribus incidunt asperiores sequi natus cumque, repudiandae, quia laudantium suscipit vero dolorem culpa rerum. Autem explicabo enim fuga doloribus consequatur nemo hic inventore dolorum a!
          </p>
          <div className="mt-6 flex justify-end">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveAssignment;
