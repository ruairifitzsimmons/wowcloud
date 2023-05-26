/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import styles from '../styles/character.module.css';

const EquippedItem = ({ media, item }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState(null);

    const handleMouseEnter = (e) => {
        setPopupPosition({ x: e.clientX, y: e.clientY });
        setShowPopup(true);
    };

    const handleMouseLeave = () => {
        setShowPopup(false);
    };

    const handleMouseMove = (e) => {
        setPopupPosition({ x: e.clientX, y: e.clientY });
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

    return (
        <div
            className={styles.item}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
            <span>{item.slot.name}</span>
        </div>

        {showPopup && popupPosition && (
            <div className={`${styles.popup} ${styles.fadeIn}`} style={{ left: popupPosition.x, top: popupPosition.y }}>
                {/* NAME */}
                <span className={styles.popupname}>{item.name}</span>

                {/* NAME DESCRIPTION */}
                {item.name_description && item.name_description.display_string && (
                    <span>{item.name_description.display_string}</span>)}
                
                {/* ITEM LEVEL */}
                <span>{item.level.display_string}</span>

                {/* TRANSMOG */}
                {item.transmog && item.transmog.display_string && (
                    <span>{item.transmog.display_string}</span>)}

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
                    ))
                }

                {/* SPELLS */}
                {item.spells &&
                    item.spells.map((spell, index) => (
                        <span key={`spell_${index}`} value={spell.value}>
                        {spell.description}
                        </span>
                    ))
                }

                {/* DURABILITY */}
                {item.durability && item.durability.display_string && (
                    <span>{item.durability.display_string}</span>)}

                {/* LEVEL REQUIREMENT */}
                {item.requirements && item.requirements.level.display_string && (
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
