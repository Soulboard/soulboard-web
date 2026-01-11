pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

pub const CAMPAIGN_KEY: &[u8] = b"campaign";
pub const ADVERTISER_KEY: &[u8] = b"advertiser";
pub const PROVIDER_KEY: &[u8] = b"provider";
pub const LOCATION_KEY: &[u8] = b"location";
pub const CAMPAIGN_LOCATION_KEY: &[u8] = b"campaign_location";

pub const MAX_CAMPAIGN_NAME_LEN: usize = 64;
pub const MAX_CAMPAIGN_DESC_LEN: usize = 256;
pub const MAX_CAMPAIGN_IMAGE_URL_LEN: usize = 256;
pub const MAX_LOCATION_NAME_LEN: usize = 64;
pub const MAX_LOCATION_DESC_LEN: usize = 256;
