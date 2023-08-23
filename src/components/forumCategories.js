import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/forum.module.css';

const ForumCategories = ({ handleCategoryClick }) => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:9000/forum/categories');
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategorySelection = (categoryId) => {
    setActiveCategory(categoryId);
    handleCategoryClick(categoryId);
  };

  return (
    <div className={styles.categoryMainContainer}>
      <div className={styles.categoryContainer}>
        <div
          className={`${styles.category} ${activeCategory === null ? styles.activeCategory : ''}`}
          onClick={() => handleCategorySelection(null)}
        >
          Show All
        </div>
        {categories.map((category) => (
          <div
            className={`${styles.category} ${activeCategory === category._id ? styles.activeCategory : ''}`}
            key={category._id}
            onClick={() => handleCategorySelection(category._id)}
          >
            {category.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumCategories;