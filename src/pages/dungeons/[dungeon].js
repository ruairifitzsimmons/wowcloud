import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getDungeons } from '../../backend/utils/blizzardApi';

const DungeonPage = ({ dungeons }) => {
  const router = useRouter();
  const { expansionId } = router.query;
  console.log('Expansion ID:', expansionId);

  const [dungeonsData, setDungeonsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dungeonsData = await getDungeons(expansionId); // Pass the 'expansionId' here
        setDungeonsData(dungeonsData.dungeons);
      } catch (error) {
        console.error('Error fetching dungeons: ', error);
      }
    };

    fetchData();
  }, [expansionId]);

  return (
    <div>
      <h1>Expansion: {dungeons.name}</h1>
      <h2>List of Dungeons:</h2>
      <ul>
        {dungeonsData.map((dungeonData) => (
          <li key={dungeonData.id}>
            <a href={`/dungeons/${expansionId}/${dungeonData.id}`}>{dungeonData.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export async function getServerSideProps({ query }) {
  try {
    const { expansionId } = query;
    const dungeons = await getDungeons(expansionId);

    return {
      props: {
        dungeons,
      },
    };
  } catch (error) {
    console.error('Error fetching dungeons: ', error);
    return {
      props: {
        dungeons: { name: '', dungeons: [] },
      },
    };
  }
}

export default DungeonPage;