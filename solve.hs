{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DeriveGeneric #-}

import Web.Scotty
import Data.Aeson (FromJSON, ToJSON, decode)
import GHC.Generics (Generic)  -- Add this import
import qualified Data.ByteString.Lazy as BL
import Data.Text.Lazy.Encoding (decodeUtf8)
import qualified Data.Text.Lazy as T
import Control.Monad.IO.Class (liftIO)
import Data.List (permutations, minimumBy)
import Data.Function (on)
import Network.Wai.Middleware.Cors (simpleCors)

-- Data structure for cities and distances
data City = City { name :: String, x :: Double, y :: Double }
  deriving (Show, Eq, Generic)  -- Deriving Generic

instance FromJSON City
instance ToJSON City

-- Function to calculate distance between two cities
distance :: City -> City -> Double
distance c1 c2 = sqrt ((x c1 - x c2) ^ 2 + (y c1 - y c2) ^ 2)

-- Brute force approach to solving TSP (replace with A* later)
tspSolver :: [City] -> ([City], Double)
tspSolver cities =
  let tours = permutations cities
      cost tour = sum (zipWith distance tour (tail tour)) + distance (last tour) (head tour)
  in minimumBy (compare `on` snd) [(tour, cost tour) | tour <- tours]

main :: IO ()
main = scotty 3000 $ do
  middleware simpleCors  -- Allow CORS

  post "/solve" $ do
    body <- body
    let cities = decode body :: Maybe [City]
    case cities of
      Just cs -> do
        let (path, totalCost) = tspSolver cs
        json (path, totalCost)
      Nothing -> text "Invalid input"