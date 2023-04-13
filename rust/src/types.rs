use std::fmt::{Display, Formatter, Result, Debug};
use std::slice::Iter;
use serde::Serialize;

#[derive(Copy, Clone, PartialEq, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum Period {
    Breakfast,
    Lunch,
    Dinner,
    Brunch
}

impl Period {
    pub fn id(&self) -> u32 {
        match self {
            Period::Breakfast => 891,
            Period::Lunch => 892,
            Period::Dinner => 893,
            Period::Brunch => 973,
        }
    }

    pub fn to_str(&self) -> &str {
        match self {
            Period::Breakfast => "breakfast",
            Period::Lunch => "lunch",
            Period::Dinner => "dinner",
            Period::Brunch => "brunch",
        }
    }

    pub fn all() -> Iter<'static, Period> {
        static PERIODS: [Period; 4] = [Period::Breakfast, Period::Lunch, Period::Dinner, Period::Brunch];
        PERIODS.iter()
    }
}

impl Display for Period {
    fn fmt(&self, f: &mut Formatter) -> Result {
        write!(f, "{}", self.to_str())
    }
}

impl Debug for Period {
    fn fmt(&self, f: &mut Formatter) -> Result {
        write!(f, "<Period [{}-{}]>", self.to_str(), self.id())
    }
}

#[derive(Copy, Clone, PartialEq, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum Location {
    Core,
    Schilleter
}

impl Location {
    pub fn id(&self) -> u32 {
        match self {
            Location::Core => 9713,
            Location::Schilleter => 1891,
        }
    }

    pub fn to_str(&self) -> &str {
        match self {
            Location::Core => "core",
            Location::Schilleter => "schilleter",
        }
    }

    pub fn all() -> Iter<'static, Location> {
        static LOCATIONS: [Location; 2] = [Location::Core, Location::Schilleter];
        LOCATIONS.iter()
    }
}

impl Display for Location {
    fn fmt(&self, f: &mut Formatter) -> Result {
        write!(f, "{}", self.to_str())
    }
}

impl Debug for Location {
    fn fmt(&self, f: &mut Formatter) -> Result {
        write!(f, "<Location [{}-{}]>", self.to_str(), self.id())
    }
}

#[derive(PartialEq)]
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

impl Debug for MenuItem {
    fn fmt(&self, f: &mut Formatter) -> Result {
        write!(f, "<MenuItem [{}]>", self.name)
    }
}

#[derive(Serialize)]
pub struct FoodItem {
    pub name: String,
    pub locations: Vec<LocationTime>
}

#[derive(Copy, Clone, Serialize)]
pub struct LocationTime {
    pub time: Period,
    pub location: Location
}

#[derive(Serialize)]
pub struct OutFile {
    pub items: Vec<FoodItem>,
    pub date: i32
}