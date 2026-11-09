import React from 'react';

const Error = ({error}) => {
    console.log('err: ',error);
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
            <h1 className="text-xl font-bold mb-2">Not Found</h1>
            <p className="text-sm text-gray-600">The requested URL was not found on this server.</p>
        </div>
    );
};

export default Error;