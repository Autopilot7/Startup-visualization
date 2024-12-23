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
import axios from 'axios';
import { endpoints } from '@/app/utils/apis';
import { create } from 'domain';

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
      facebook_url,
      memberships,
      advisors,
      notes: initialNotes,
      pitch_deck,
      location,
    } = props;
    
    const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
    const activeMemberships = memberships.filter((m) => m.status);
    const { isAuthenticated } = useContext(AuthContext);
    const [isEditNotesModalVisible, setIsEditNotesModalVisible] = useState(false);
    const [notes, setNotes] = useState(initialNotes || []);
    const [newNoteContent, setNewNoteContent] = useState('');

    const handleAddNote = async () => {
        try {
            const response = await axios.post(endpoints.createnotes, {
                content: newNoteContent,
                content_type: 'startup', // Assuming the note is for a startup
                object_id: id, // The ID of the startup
            });
            // Add the new note to the state
            setNotes((prevNotes) => [...prevNotes, response.data]);
            setNewNoteContent('');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error creating note:', error.response?.data || error.message);
            } else {
                console.error('Error creating note:', error);
            }
        }
    };

    const handleUpdateNote = async (noteId: string, updatedContent: string) => {
        try {
            await axios.put(`${endpoints.notes}/${noteId}`, { content: updatedContent });
            setNotes((prevNotes) =>
                prevNotes.map((note) => (note.id === noteId ? { ...note, content: updatedContent } : note))
            );
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const handleDeleteNote = async (noteId: string) => {
        try {
            await axios.delete(`${endpoints.notes}/${noteId}`);
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    return (
        <div className="w-full h-full bg-white space-y">
            <div className='flex'>
                <div>
                <div className='flex flex-col gap-y-2'>
                    <div className="w-[70rem] bg-white rounded-2xl p-6 flex gap-x-8 mb-1">
                        <img 
                        src={avatar}
                        width={100}
                        height={100}

                        className="flex-shrink-0 max-md:mx-auto h-20 w-20 object-cover rounded-full md:mx-0 md:h-24 md:w-24"

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
                    
                    <div className="flex items-center">

                    <div className="ml-4 flex items-center space-x-2 mb-4">
                            <span className="bg-yellow-500 text-white text-sm px-2.5 py-0.5 rounded">{batch}</span>
                            <span className="bg-orange-500 text-white text-sm px-2.5 py-0.5 rounded">{phases}</span>
                            <span className="bg-red-600 text-white text-sm px-2.5 py-0.5 rounded">{priority}</span>
                            <span className="bg-green-500 text-white text-sm px-2.5 py-0.5 rounded">{status}</span>
                            
                        </div>
                        {isAuthenticated && (
                            
                        <><button
                                onClick={() => setIsUpdateFormVisible(true)}
                                className="bg-blue-500 text-white px-1 py-2 rounded-md hover:bg-blue-600 ml-60 font-semibold"
                            >
                                Edit Startup
                            </button><button
                                onClick={() => setIsEditNotesModalVisible(true)}
                                className="bg-purple-500 text-white px-1 py-2 rounded-md hover:bg-purple-600 ml-2 font-semibold"
                            >
                                    Edit Notes
                                </button></>
                        )}
                    </div>
                </div>
                
                
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
                    <a href={facebook_url} target="_blank" rel="noopener noreferrer">
                        <FaFacebook size={44} className="text-blue-800 cursor-pointer" />
                    </a>                
                    
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

                
                <div>
                <h2 className="center text-5xl font-bold mt-7 mb-8">Pitch deck</h2>

                <div style={{ width: '100%', height: '400px' }}>
                <iframe
                    src={pitch_deck}
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
                            
                            />
                            ))}
                        </div>
                </div>

                
            </div>
            {/* Edit Notes Modal */}
            {isEditNotesModalVisible && (
                <Modal
                    isOpen={isEditNotesModalVisible}
                    onClose={() => setIsEditNotesModalVisible(false)}
                    title="Edit Notes"
                >
                    <div>
                        {notes.map((note) => (
                            <div key={note.id} className="mb-4 p-4 border rounded">
                                <textarea
                                    className="w-full border p-2 rounded"
                                    value={note.content}
                                    onChange={(e) => handleUpdateNote(note.id, e.target.value)}
                                />
                                <button
                                    onClick={() => handleDeleteNote(note.id)}
                                    className="text-red-500 mt-2 hover:underline"
                                >
                                    Delete Note
                                </button>
                            </div>
                        ))}
                        <div className="mt-4">
                            <textarea
                                className="w-full border p-2 rounded"
                                placeholder="Add a new note"
                                value={newNoteContent}
                                onChange={(e) => setNewNoteContent(e.target.value)}
                            />
                            <button
                                onClick={handleAddNote}
                                className="bg-green-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-green-600"
                            >
                                Add Note
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
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
