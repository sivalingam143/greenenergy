// src/components/SkeletonLoader.js
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonLoader = () => {
    return (
        <div>
            <Skeleton height={30} count={1} />
            <Skeleton height={200} count={1} />
            <Skeleton height={30} count={3} />
        </div>
    );
};

export default SkeletonLoader;
