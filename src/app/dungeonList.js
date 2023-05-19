"use client";
import { getDungeons } from './api';
import React, { useEffect, useState } from "react";

function DungeonList() {
  const [dungeons, setDungeons] = useState([]);

  useEffect(() => {
    async function fetchDungeons() {
      try {
        const data = await getDungeons();
        setDungeons(data.instances);
      } catch (error) {
        // error
      }
    }

    fetchDungeons();
  }, []);

  return (
    <div>
      <h1>Dungeons</h1>
      <ul>
        {dungeons.map((dungeon) => (
          <li key={dungeon.id}>{dungeon.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default DungeonList;