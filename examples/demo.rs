use cyb_bee::BioObservation;
fn main() {
    let o = BioObservation {
        animal_id: "hive-003".into(),
        kind: "temperature".into(),
        value: "34 C".into(),
        observed_at: chrono::Utc::now(),
        source: "demo-fixture".into(),
    };
    o.validate().unwrap();
    println!("{} {}", o.graph_subject(), o.graph_event());
}
