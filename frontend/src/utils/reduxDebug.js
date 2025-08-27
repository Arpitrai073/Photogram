// Utility functions for debugging Redux state issues

export const isSerializable = (obj) => {
    try {
        JSON.stringify(obj);
        return true;
    } catch (error) {
        return false;
    }
};

export const findNonSerializableValue = (obj, path = '') => {
    if (obj === null || obj === undefined) return null;
    
    if (typeof obj === 'function') {
        return `${path} contains a function`;
    }
    
    if (typeof obj === 'symbol') {
        return `${path} contains a symbol`;
    }
    
    if (obj instanceof Date) return null; // Dates are serializable
    
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            const result = findNonSerializableValue(obj[i], `${path}[${i}]`);
            if (result) return result;
        }
        return null;
    }
    
    if (typeof obj === 'object') {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const result = findNonSerializableValue(obj[key], `${path}.${key}`);
                if (result) return result;
            }
        }
        return null;
    }
    
    return null;
};

export const sanitizeForRedux = (obj) => {
    if (obj === null || obj === undefined) return obj;
    
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        return obj;
    }
    
    if (obj instanceof Date) {
        return obj.toISOString();
    }
    
    if (Array.isArray(obj)) {
        return obj.map(sanitizeForRedux);
    }
    
    if (typeof obj === 'object') {
        const sanitized = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                try {
                    sanitized[key] = sanitizeForRedux(obj[key]);
                } catch (error) {
                    console.warn(`Failed to sanitize key ${key}:`, error);
                    sanitized[key] = null;
                }
            }
        }
        return sanitized;
    }
    
    return null;
};

export const logReduxState = (state, sliceName = 'state') => {
    console.group(`Redux State: ${sliceName}`);
    console.log('State:', state);
    
    const nonSerializable = findNonSerializableValue(state);
    if (nonSerializable) {
        console.warn('Non-serializable value found:', nonSerializable);
    } else {
        console.log('State is serializable');
    }
    
    console.groupEnd();
};
