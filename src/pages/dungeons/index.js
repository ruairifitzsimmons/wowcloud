import { useRouter } from 'next/router';
import { getDungeons } from '../../backend/utils/blizzardApi';

const DungeonPage = ({ dungeons }) => {
  const router = useRouter();
  const { expansion } = router.query;
  console.log('Expansion:', expansion);

  return (
    <div>
      <h1>Expansion: {expansion}</h1>
      <h2>List of Dungeons:</h2>
      <ul>
        {dungeons.map((dungeon) => (
          <li key={dungeon.id}>
            <a href={`/dungeons/${expansion}/${dungeon.id}`}>{dungeon.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  try {
    const { expansion } = params;
    const dungeons = await getDungeons(expansion);
    
    return {
      props: {
        dungeons,
      },
    };
  } catch (error) {
    console.error('Error fetching dungeons: ', error);
    return {
      props: {
        dungeons: [],
      },
    };
  }
}

export default DungeonPage;