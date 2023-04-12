use std::fmt::{Display, Formatter, Result};

pub enum Period {
    Breakfast,
    Lunch,
    Dinner,
    Brunch
}

pub enum Location {
    Core,
    Schilleter
}

pub enum FoodCategory {
    Entrees,
    Sandwiches,
    Cereals,
    Pizza,
    Sides,
    Soups,
    Breads,
    Desserts,
    Protein,
    Grains,
    Salads,
    Condiments,
    Sauces,
    Other
}

pub struct MenuItem {
    pub name: String,
    pub categories: Vec<FoodCategory>,
}

// implement display trait
impl Display for MenuItem {
    fn fmt(&self, f: &mut Formatter) -> Result {
        write!(f, "{}", self.name)
    }
}