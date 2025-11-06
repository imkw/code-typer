import React, { useState } from 'react';

const MyComponent = () => {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(count + 1);
    };

    return (
        <div className="component">
            <h1>计数器: {count}</h1>
            <button onClick={handleClick}>
                点击增加
            </button>
        </div>
    );
};

export default MyComponent;