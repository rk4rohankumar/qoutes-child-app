// Async boundary so webpack can negotiate the shared React singleton with the
// host (or fall back to the local copy standalone) before any React code runs.
import('./bootstrap');
