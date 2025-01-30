use std::time::{Duration, Instant};

trait Average {
    fn avg (&self) -> f32;
} 

impl Average for Vec<Duration> {
    fn avg (&self) -> f32 {
        let len = self.len() as f32;
        self.clone().into_iter()
        .reduce(|mut acc, duration| {acc += duration; acc})
        .unwrap_or_default().as_millis() as f32 / len
    }
}

#[derive(Debug)]
pub struct PerformanceTimer {
    start: Instant,
    pub generations: Vec<Duration>,
    pub validations: Vec<Duration>,
    pub solutions: Vec<Duration>,
    pub classifications: Vec<Duration>,
    pub dbinsertions: Vec<Duration>
}

impl PerformanceTimer {
    pub fn new() -> Self {
        Self {
            start: Instant::now(),
            generations: Vec::new(),
            validations: Vec::new(),
            solutions: Vec::new(),
            classifications: Vec::new(),
            dbinsertions: Vec::new()
        }
    }

    pub fn stop(&self) {
        let total = self.start.elapsed().as_millis() as f32;
        let avg_generation = self.generations.avg();
        let avg_validation = self.validations.avg();
        let avg_solution = self.solutions.avg();
        let avg_classification = self.classifications.avg();
        let avg_dbinsertion = self.dbinsertions.avg();
        println!("Insertion took {:.2} ms\navg_generation lasted {:.2} s\n avg_validation lasted {:.2} s\n avg_solution lasted {:.2} s\n avg_classification lasted {:.2} s\n avg_dbinsertion lasted {:.2} s",
            total,
            avg_generation,
            avg_validation,
            avg_solution,
            avg_classification,
            avg_dbinsertion
        )
    } 
}