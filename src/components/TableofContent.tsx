import React from 'react';

interface TableOfContentProps {
    sections: string[]; 
    onSectionClick: (section: string) => void;
}

const TableOfContent: React.FC<TableOfContentProps> = ({ sections, onSectionClick }) => {
    return (
        <div className="table-of-content">
            <h2>Table of Contents</h2>
            <ul>
                {sections.map((section, index) => (
                    <li key={index}>
                        <button
                            onClick={() => onSectionClick(section)}
                            className="toc-button"
                        >
                            {section}
                        </button>
                    </li>
                ))}
            </ul>

            <style jsx>{`
                .table-of-content {
                    padding: 1rem;
                    background-color: #f5f5f5;
                    border-radius: 4px;
                    margin: 1rem 0;
                }

                .toc-button {
                    background: none;
                    border: none;
                    color: #0066cc;
                    cursor: pointer;
                    padding: 0.5rem;
                    text-align: left;
                    width: 100%;
                }

                .toc-button:hover {
                    text-decoration: underline;
                }

                ul {
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                }

                li {
                    margin: 0.5rem 0;
                }
            `}</style>
        </div>
    );
};

export default TableOfContent;