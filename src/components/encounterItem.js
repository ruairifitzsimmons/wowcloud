import styles from "../styles/dungeon.module.css";

const EncounterItems = ({ items, onItemMouseEnter, onItemMouseLeave, hoveredItem, popupPosition }) => {
  const getItemQualityName = (qualityType) => {
    switch (qualityType) {
      case "EPIC":
        return styles.epic;
      case "RARE":
        return styles.rare;
      case "UNCOMMON":
        return styles.uncommon;
      case "COMMON":
        return styles.common;
      default:
        return "Unknown";
    }
  };

  return (
    <div className={styles.itemContainer}>
        
      {items && items.map((item) => {
        const qualityClass = getItemQualityName(item.information.quality.type);

        return (
          <div
            className={styles.item}
            key={item.id}
            onMouseEnter={() => onItemMouseEnter(item)}
            onMouseLeave={() => onItemMouseLeave()}
          >
            <img
              className={styles.itemImage}
              src={item.media}
              alt={item.item.name}
            />
            <div className={styles.itemHeader}>
              <span className={`${styles.itemName} ${qualityClass}`}>
                {item.item.name}
              </span>
              <span className={styles.itemLevel}>
                {item.information.level}
              </span>
            </div>
            {hoveredItem === item && (
              <div
                className={styles.itemPopup}
                style={{
                  left: `${popupPosition.x}px`,
                  top: `${popupPosition.y}px`,
                }}
              >
                <span className={`${styles.popupname} ${qualityClass}`}>
                  {item.item.name}
                </span>
                {item.information.level && (
                  <span className={styles.popupitemlevel}>
                    Item Level {item.information.level}
                  </span>
                )}

                {item.information.preview_item.binding && (
                  <span>
                    {item.information.preview_item.binding.name}
                  </span>
                )}

                <div className={styles.itemslotarmor}>
                  {item.information.preview_item.inventory_type && (
                    <span>
                      {item.information.preview_item.inventory_type.name}
                    </span>
                  )}
                  {item.information.preview_item.item_subclass && (
                    <span>
                      {item.information.preview_item.item_subclass.name}
                    </span>
                  )}
                </div>

                {item.information.preview_item.weapon && (
                  <div className={styles.itemslotarmor}>
                    <span>
                      {item.information.preview_item.weapon.damage.display_string}
                    </span>
                    <span>
                      {item.information.preview_item.weapon.attack_speed.display_string}
                    </span>
                  </div>
                )}

                {item.information.preview_item.stats &&
                  item.information.preview_item.stats.map((stat, index) => (
                    <span key={`stat_${index}`} value={stat.value}>
                      {stat.display.display_string}
                    </span>
                  ))}

                {item.information.preview_item.requirements && (
                  <span>
                    {item.information.preview_item.requirements.level.display_string}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EncounterItems;
