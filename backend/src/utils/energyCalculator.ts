export class EnergyCalculator {
    /**
     * Calculates energy in Watt-hours (Wh) based on power rating and active duration
     * Formula: Energy (kWh) = (powerRating * activeTimeSeconds) / (1000 * 3600)
     * To get Watt-hours: Energy (Wh) = Energy (kWh) * 1000
     * Simplification: Energy (Wh) = (powerRating * activeTimeSeconds) / 3600
     */
    static calculateWattHours(powerRatingWatts: number, activeTimeSeconds: number): number {
        return (powerRatingWatts * activeTimeSeconds) / 3600;
    }
}
