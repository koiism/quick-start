/**
 * 根据经纬度计算两点间的距离
 * @param lat1 
 * @param lon1 
 * @param lat2 
 * @param lon2 
 * @returns 
 */
function calculateDistanceKM(lat1, lon1, lat2, lon2) {
    // 地球半径，单位为公里
    const R = 6371;

    // 将角度转换为弧度
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;

    // Haversine公式计算两点间距离的平方
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // 计算并返回两点间的实际距离
    const distance = R * c;
    return distance;
}

enum DISTANCE_UNIT {
    KM = 'km',
    M = 'm'
}

function calDistance(lat1, lon1, lat2, lon2: number, unit: string): string {
    var distance = calculateDistanceKM(lat1, lon1, lat2, lon2);
    if (unit === DISTANCE_UNIT.M) {
        distance = distance * 1000;
    }
    return distance.toFixed(2) + unit;
}

function getUserId(ctx): number {
    if (!ctx.req.headers["mie-mie-shi-zhu-cheng"]?.length) {
        return Number.NaN;
    }
    return Number(ctx.req.headers["mie-mie-shi-zhu-cheng"]);
}