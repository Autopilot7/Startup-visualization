'use client'
import React, { useContext } from 'react';
import { FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';
import { Note, Startup, StartupCardProps } from './dashboard/StartupCard';
import { useState } from 'react';
import UpdateStartupForm from '@/components/forms/UpdateStartupForm'; // Adjust the import path as needed
import Modal from '@/components/Modal'; // If you're using a modal component
import Link from 'next/link';
import MemberCard from './Membercard';
import AdvisorCard from './Advisorcard';
import { fetchAdvisorById } from '@/app/actions';
import { AuthContext } from '@/context/AuthContext';

export default function StartupInfo(props: Startup): React.JSX.Element {
    const {
      id,
      name,
      long_description,
      short_description,
      avatar,
      status,
      priority,
      phases,
      batch,
      linkedin_url,
      memberships,
      advisors,
      notes,
      pitch_deck,
      location,
    } = props;
    
    const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
    const activeMemberships = memberships.filter((m) => m.status);
    const { isAuthenticated } = useContext(AuthContext);
    return (
        <div className="w-full h-full bg-white space-y">
            <div className='flex'>
                <div>
                <div className='flex flex-col gap-y-2'>
                    <div className="w-[70rem] bg-white rounded-2xl p-6 flex gap-x-8 mb-1">
                        <img 
                        src={avatar}
                        className="w-[7rem] rounded-full left-1"
                        alt=""
                        />
                        
                        {/* Use a nested container so you can stack {name} and shortDescription vertically */}
                        <div className="flex flex-col self-center">
                        <h1 className="text-5xl font-bold">{name}</h1>
                        {/* Here we insert the short description below the name */}
                        <p className="text-gray-600 mt-2">
                            {short_description}
                        </p>
                        <p className="text-dark-500 font-bold">
                            {location}
                        </p>
                        </div>
                    </div>
                    </div>

                    <div className="ml-4 flex items-center mb-4">
                        <span className="bg-yellow-500 text-white text-sm mr-2 px-2.5 py-0.5 rounded">{batch}</span>
                        <span className="bg-orange-500 text-white text-sm mr-2 px-2.5 py-0.5 rounded">{phases}</span>
                        <span className="bg-red-600 text-white text-sm mr-2 px-2.5 py-0.5 rounded">{priority}</span>
                        <span className="bg-green-500 text-white text-sm mr-2 px-2.5 py-0.5 rounded">{status}</span>
                        {/* <div className="flex items-center gap-6 ml-auto mr-auto">
                            <span className="bg-yellow-500 text-white text-sm mr-2 px-2.5 py-0.5 rounded">Location</span>
                         </div> */}
                    </div>
                    
                </div>
                
                <button
                onClick={() => setIsUpdateFormVisible(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-4"
                >
                Edit Startup
                </button>
            </div>

            <div className="w-full flex justify-center my-4">
                <div style={{width: '160rem', height: '2px', backgroundColor: '#DBDBDB'}}></div>
            </div>

            <div className='flex items-center'>
                <h1 className = 'text-xl ml-4 font text-purple-600'>ACTIVE MEMBER</h1>
                <div className="flex items-center ml-4 relative"></div>


                {activeMemberships.slice(0, 4).map((membership, index) => {
                const member = membership.member;
                const avatarUrl = member.avatar || 'https://via.placeholder.com/43x38';
                return (
                    <Link
                    key={membership.id}
                    href={`/membercard/${member.id}`}
                    className={`relative w-[42.76px] h-[42.76px] rounded-full border border-white overflow-hidden ${
                        index > 0 ? '-ml-2' : ''
                    }`}
                    >
                    <img
                        className="object-cover w-full h-full"
                        src={avatarUrl}
                        alt={member.name || 'Member Avatar'}
                    />
                    </Link>
                );
                })}

                {/* If there are more than 2 active members, show a "+X" badge for the rest */}
                {activeMemberships.length > 2 && (
                <div className="w-[42.76px] h-[42.76px] rounded-full border bg-gray-300 -ml-2 flex justify-center items-center text-gray-600 font-semibold">
                    +{activeMemberships.length - 2}
                </div>
                )}


                <div className="flex tems-center gap-6 ml-auto mr-10">
                    <a href={linkedin_url} target="_blank" rel="noopener noreferrer">
                        <FaLinkedin size={44} className="text-blue-600 cursor-pointer" />
                    </a>
                    <FaFacebook size={44} className="text-blue-800 cursor-pointer" />
                    <FaInstagram size={44} className="text-pink-600 cursor-pointer" />
                </div>
            </div>

            <div className="w-full flex justify-center my-4">
                <div style={{width: '160rem', height: '2px', backgroundColor: '#DBDBDB'}}></div>
            </div>

            <div className="flex flex-col ml-4">
                <div>
                    <h2 className="text-5xl font-semibold mt-7 mb-7">Project Description</h2>
                    <p className="text-gray-700 text-2xl ">
                    {long_description}
                    </p>
                </div>

                {/* <div>
                    <h2 className="text-5xl font-bold mt-7 mb-7">Latest News</h2>
                    <ul className="space-y-4">
                        <li>
                            <a href="https://vinuni.edu.vn/vinuni-and-techcombank-jointly-cultivate-a-future-generation-of-financially-savvy-leaders-through-strategic-cooperation/" 
                               className="text-blue-400 underline text-2xl font-semibold">
                                VinUni and Techcombank jointly cultivate a future generation of financially savvy leaders through strategic cooperation
                            </a>
                            <p className="text-xl mt-2">May 2024</p>
                        </li>
                        <li>
                            <a href="https://vinuni.edu.vn/vinuni-students-win-prizes-in-domestic-and-foreign-startup-competitions-with-the-desire-to-improve-understanding-of-personal-finance-for-young-vietnamese-people/" 
                               className="text-blue-400 underline text-2xl font-semibold">
                                VinUni students win prizes in domestic and foreign startup competitions with an edtech solution
                            </a>
                            <p className="text-xl mt-2">Oct 2023</p>
                        </li>
                    </ul>
                </div> */}

                
                {isAuthenticated && 
                <div> 
                <h2 className="text-5xl font-bold mt-7 mb-8">Notes</h2>
                    
                {notes && notes.length > 0 ? (
                <div>
                    {notes.map((note: Note) => (
                    <div key={note.id} className="mb-4 p-4 border rounded">
                        <p><strong>Note:</strong> {note.content}</p>
                    </div>
                    ))}
                </div>
                ) : (
                <p>No notes available.</p>
                )}
                </div>
}

                
{/* <div>
                    <h2 className="text-5xl font-bold mt-7 mb-8">Revenue</h2>
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold text-blue-600">Seed Round</h3>
                                    <p className="text-gray-600 text-lg mt-1">December 2023</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-bold text-green-600">$500K</span>
                                    <p className="text-sm text-gray-500">Investment</p>
                                </div>
                            </div>
                        </div>  

                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold text-blue-600">Pre-seed Round</h3>
                                    <p className="text-gray-600 text-lg mt-1">June 2023</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-bold text-green-600">$100K</span>
                                    <p className="text-sm text-gray-500">Investment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 */}
                
                <div>
                <h2 className="center text-5xl font-bold mt-7 mb-8">Pitch deck</h2>

                <div>
                <iframe
                    // src={pitch_deck}
                    src = {"https://th.bing.com/th/id/OIP.GT4256Odg6UjsYKIgYmOyAHaEI?rs=1&pid=ImgDetMain"}
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    title="PDF Viewer"
                ></iframe>
                </div>
                
                </div>

                <div>
                <h2 className="ml-auto mr-auto text-5xl font-bold mt-7 mb-8">Members</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {memberships.map((advisor) => (
                            <MemberCard
                                key={advisor.id}
                                id={advisor.member.id}
                                name={advisor.member.name}
                                avatar={advisor.member.avatar || undefined}
                                // If membership array is available, pass it
                                // memberships={member.memberships}
                            />
                            ))}
                        </div>
                </div>

                <div>
                <h2 className="ml-auto mr-auto text-5xl font-bold mt-7 mb-8">Advisors</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {advisors.map((advisor) => (
                            <AdvisorCard
                                key={advisor.id}
                                id={advisor.id}
                                name={advisor.name}
                                avatar={advisor.avatar ?? undefined}
                                // If membership array is available, pass it
                                // memberships={member.memberships}
                            />
                            ))}
                        </div>
                </div>

                
            </div>
            {isUpdateFormVisible && (
            <Modal
            isOpen={isUpdateFormVisible}
            onClose={() => setIsUpdateFormVisible(false)}
            title="Update Startup"
            maxWidth="max-w-full"
            >
            <UpdateStartupForm
                startupId={id} // Pass the startup ID to fetch data inside the form
                onClose={() => setIsUpdateFormVisible(false)}
            />
            </Modal>
        )}
        </div>
        
    );
}
