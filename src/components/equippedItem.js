/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef } from 'react';
import styles from '../styles/character.module.css';

const EquippedItem = ({ media, item, index }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupPositions, setPopupPositions] = useState([]);
  const parentRef = useRef(null);

  const handleMouseEnter = (e) => {
    if (!showPopup) {
      const rect = parentRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const updatedPositions = [...popupPositions];
      updatedPositions[index] = { x, y };
      setPopupPositions(updatedPositions);
    }
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  const handleMouseMove = (e) => {
    const rect = parentRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPopupPositions((positions) => {
      const updatedPositions = [...positions];
      updatedPositions[index] = { x, y };
      return updatedPositions;
    });
  };

  useEffect(() => {
    if (showPopup) {
      document.addEventListener('mousemove', handleMouseMove);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [showPopup]);

  useEffect(() => {
    setPopupPositions((positions) => {
      const updatedPositions = [...positions];
      updatedPositions[index] = updatedPositions[index] || {};
      return updatedPositions;
    });
  }, [index]);

  return (
    <div
      className={styles.item}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={parentRef}
    >
      {media && media.assets && media.assets.length > 0 && (
        <img
          className={styles.itemimage}
          src={media.assets[0].value}
          alt="Equipment Media"
        />
      )}
      {/* ITEM DETAILS */}
      <div className={styles.iteminfo}>
        <span className={styles.itemname}>{item.name}</span>
        <span className={styles.itemslotname}>{item.slot.name}</span>
      </div>

      {showPopup && (
        <div
          className={styles.popup}
          style={{
            left: `${popupPositions[index]?.x ?? 0}px`,
            top: `${popupPositions[index]?.y ?? 0}px`,
          }}
        >
          {/* Popup content */}
          <span className={styles.popupname}>{item.name}</span>

          {/* NAME DESCRIPTION */}
          {item.name_description && item.name_description.display_string && (
            <span>{item.name_description.display_string}</span>
          )}

          {/* ITEM LEVEL */}
          <span>{item.level.display_string}</span>

          {/* TRANSMOG */}
          {item.transmog && item.transmog.display_string && (
            <span>{item.transmog.display_string}</span>
          )}

          {/* BINDING */}
          <span>{item.binding.name}</span>

          {/* LIMIT CATEGORY */}
          <span>{item.limit_category}</span>

          {/* SLOT NAME & ARMOR TYPE */}
          <div className={styles.itemslotarmor}>
            <span>{item.slot.name}</span>
            <span>{item.item_subclass.name}</span>
          </div>

          {/* STATS */}
          {item.stats &&
            item.stats.map((stat, index) => (
              <span key={`stat_${index}`} value={stat.value}>
                {stat.display.display_string}
              </span>
            ))}

          {/* SPELLS */}
          {item.spells &&
            item.spells.map((spell, index) => (
              <span key={`spell_${index}`} value={spell.value}>
                {spell.description}
              </span>
            ))}

          {/* DURABILITY */}
          {item.durability && item.durability.display_string && (
            <span>{item.durability.display_string}</span>
          )}

          {/* LEVEL REQUIREMENT */}
          {item.requirements && item.requirements?.level?.display_string && (
            <span>{item.requirements.level.display_string}</span>
          )}

          {/* CLASS REQUIREMENT */}
          {item.requirements && item.requirements.playable_classes && (
            <span>{item.requirements.playable_classes.display_string}</span>
          )}

          {/* ENCHANTED */}
          {item.enchantments && item.enchantments.display_string && (
            <span>{item.enchantments.playable_classes.display_string}</span>
          )}

          {/* SELL PRICE */}
          {item.sell_price && item.sell_price.display_strings && (
            <span>
              {item.sell_price.display_strings.header}&nbsp;
              {item.sell_price.display_strings.gold}&nbsp;
              {item.sell_price.display_strings.silver}&nbsp;
              {item.sell_price.display_strings.copper}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default EquippedItem;
