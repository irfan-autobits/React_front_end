// src/components/AnalysisTable.js
import React, { useState, useEffect } from 'react';
import Cell from "./cell";
const API_URL = process.env.REACT_APP_API_URL;

export default function AnalysisTable() {
  const [data, setData]         = useState([]);
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [sortField, setSortField] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading]   = useState(true);
  const [total, setTotal]       = useState(0);
  const ITEMS_PER_PAGE = 100;

  const limit = ITEMS_PER_PAGE;  // no need for useState
  const fetchData = async () => {
    setLoading(true);
    const qs = new URLSearchParams({ 
       page, 
       limit, 
       search, 
       sort_field: sortField, 
       sort_order: sortOrder 
    });
    const res = await fetch(`${API_URL}/api/reco_table?${qs}`);
    const json = await res.json();
    setData(json.detections || []);
    setTotal(json.total || 0);
    setLoading(false);
  };

  // re-fetch on any dependency change
   useEffect(() => {
     setLoading(true);
     async function doFetch() {
       try {fetchData();
       } 
       finally {
         setLoading(false);
       }
     }
     doFetch();
   }, [page, search, sortField, sortOrder]);  // now the callback itself is sync

  const handleSort = field => {
    if (sortField === field) {
      setSortOrder(o => o === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  return (
    <div>
      <h2>Detection Table</h2>

      <input
        type="search"
        placeholder="Search…"
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
      />

      {loading
        ? <p>Loading…</p>
        : (
          <>
            <table>
              <thead>
                <tr>
                  {[
                    ["ID",           "id"],           // now ties back to rec_no on the server
                    ["Person",       "subject"],
                    ["Camera",       "camera_name"],
                    ["Tag",          "camera_tag"],
                    ["Score",        "det_score"],
                    ["Distance",     "distance"],
                    ["When",         "timestamp"],
                  ].map(([label, key]) => (
                    <th key={key} onClick={()=>handleSort(key)}>
                      {label}
                      {sortField===key ? (sortOrder==="asc"?" 🔼":" 🔽") : null}
                    </th>
                  ))}
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d,i) => (
                  <tr key={i}>
                    <td>{d.id}</td>
                    <td>{d.subject}</td>
                    <td>{d.camera_name}</td>
                    <td>{d.camera_tag}</td>
                    <td>{d.det_score.toFixed(1)}%</td>
                    <td>{d.distance}</td>
                    <td><Cell ts={d.timestamp} /></td>
                    <td>
                      <img 
                        src={d.det_face}
                        width={50}
                        height={50}
                        alt={`  ${d.subject}`} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
            <button onClick={()=>setPage(p=>Math.max(p-1,1))} disabled={page===1}>
              Prev
            </button>
            <span>
              Page {page} of {Math.ceil(total/limit)}
            </span>
            <button 
              onClick={()=>setPage(p=>p+1)} 
              disabled={page >= Math.ceil(total/limit)}
            >
              Next
            </button>
            </div>
          </>
        )
      }
    </div>
  );
}
