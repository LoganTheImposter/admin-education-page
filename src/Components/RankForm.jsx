import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RankForm.css'; // Import CSS file

function RankForm({ onClose }) {
    const [ranks, setRanks] = useState([]);
    const [newRank, setNewRank] = useState('');
    const [rankState, setRankState] = useState(0);

    useEffect(() => {
        fetchRanks();
    }, []);

    const fetchRanks = async () => {
        try {
            const response = await axios.get('http://13.238.142.81/education-api/admin/staff/rank/read.php');
            setRanks(response.data);
        } catch (error) {
            console.error("Error fetching ranks", error);
        }
    };

    const handleAddRank = async () => {
        try {
            const rankResponse = await axios.post('http://13.238.142.81/education-api/admin/staff/rank/create.php', {
                S_rank: newRank,
                rank_state: rankState
            });
            if (rankResponse.data.status === 'success') {
                setNewRank('');
                setRankState(rankState + 1);
                fetchRanks();
            } else {
                alert('Failed to add rank');
            }
        } catch (error) {
            console.error("Error adding rank", error);
        }
    };

    const handleRankStateChange = async (id, newRankState) => { 
        try {
            await axios.post('http://13.238.142.81/education-api/admin/staff/rank/update.php', {
                id: id,
                rank_state: newRankState
            });
            fetchRanks();
        } catch (error) {
            console.error("Error updating rank state", error);
        }
    };

    const handleDeleteRank = async (id) => {
        try {
            await axios.post('http://13.238.142.81/education-api/admin/staff/rank/delete.php', { id });
            fetchRanks();
        } catch (error) {
            console.error("Error deleting rank", error);
        }
    };

    return (
        <div className="rank-form-container">
            <h2>จัดการตำแหน่ง</h2>
            <input
                type="text"
                value={newRank}
                onChange={(e) => setNewRank(e.target.value)}
                placeholder="เพิ่มตำแหน่งใหม่"
            />
            <button onClick={handleAddRank}>เพิ่มตำแหน่ง</button>
            <ul className="rank-list">
                {ranks.map((rank) => (
                    <li key={rank.id}>
                        {rank.S_rank}
                        <input
                            type="number"
                            value={rank.rank_state}
                            onChange={(e) => handleRankStateChange(rank.id, parseInt(e.target.value))}
                            min="0"
                        />
                        <button onClick={() => handleDeleteRank(rank.id)}>ลบ</button>
                    </li>
                ))}
            </ul>
            <button onClick={onClose}>ปิด</button>
        </div>
    );
}

export default RankForm;
