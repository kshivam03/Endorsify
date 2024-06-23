import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const StudentRequests = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [requests, setRequests] = useState([]);
    const [student, setStudent] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8000/api/students/getallrequests/${user.email}`)
            .then(response => {
                setRequests(response.data);
            })
            .catch(error => {
                console.log(error);
            });

            axios
            .get(`http://localhost:8000/api/students/getstudent/${user.email}`)
            .then(response => {
                setStudent(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const view = async (state) => {
        try {
          const response = await axios.get(`http://localhost:8000/api/professors/getlor/${state.professorId}/${student._id}`);
          const documentUrl = response.data;
          navigate('/viewdocx', { state: { documentUrl } });
        } catch (error) {
          console.error("Error fetching document URL:", error);
          // Handle error if needed
        }
      }

    return (
        <div className="request-list" style={{ display: "flex", flexDirection: "column" }}>
            {requests.length > 0 && requests.map((request, index) => (
                <div className="request-item" key={index} style={{ display: "flex", marginBottom: "20px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", borderRadius: "8px", padding: "20px" }}>
                    <img src={request.professorData.profilePhoto} alt="Professor" className="profile-pic" style={{ width: "100px", height: "100px", borderRadius: "50%", marginRight: "20px" }} />
                    <div className="details" style={{ flex: 1 }}>
                        <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>{request.professorData.name}</p>
                        <p style={{ fontSize: "16px", marginBottom: "5px" }}>Email: {request.professorData.email}</p>
                        <p style={{ fontSize: "16px", marginBottom: "0" }}>Status: {request.lorStatus}</p> 
                        {request.lorStatus === 'rejected' && (
                           <p style={{ fontSize: "16px", marginBottom: "5px" }}> Reason:{request.rejectReason}</p>
                        )}
                    </div>
                    {request.lorStatus === 'accepted' && (
                            <div style={{ marginTop: "20px", marginRight: "50px" }}>
                                <Button type="primary" onClick={() => view({professorId : request.professorId})}>View LOR</Button>
                            </div>
                        )}
                         
                </div>
            ))}
        </div>
    );
};

export default StudentRequests;
