// components/UserDetails.jsx

interface UserDetailsProps {
    details: {
        name: string;
        email: string;
        phone: string;
        role: string;
        address: string;
    };
}
function UserDetails({ details}: UserDetailsProps ) {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">📋 Миний Мэдээлэл</h2>
            <div className="space-y-2">
                <p>
                    <span className="font-medium text-gray-600">Нэр:</span> 
                    <span className="ml-2 text-gray-900">{details.name}</span>
                </p>
                <p>
                    <span className="font-medium text-gray-600">И-мэйл:</span> 
                    <span className="ml-2 text-gray-900">{details.email}</span>
                </p>
                <p>
                    <span className="font-medium text-gray-600">Утас:</span> 
                    <span className="ml-2 text-gray-900">{details.role}</span>
                </p>
                <p>
                    <span className="font-medium text-gray-600">Хаяг:</span> 
                    <span className="ml-2 text-gray-900">{details.address}</span>
                </p>
            </div>
            {/* <button className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600">Мэдээлэл Засах</button> */}
        </div>
    );
}