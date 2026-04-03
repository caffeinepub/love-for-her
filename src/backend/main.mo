import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization infrastructure
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Custom types
  type Shayari = {
    id : Text;
    title : Text;
    body : Text;
    order : Nat;
  };

  type LoveQuote = {
    id : Text;
    text : Text;
    author : ?Text;
  };

  type PhotoEntry = {
    id : Text;
    blob : Storage.ExternalBlob;
    caption : Text;
    order : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  module Shayari {
    public func compare(sh1 : Shayari, sh2 : Shayari) : Order.Order {
      Nat.compare(sh1.order, sh2.order);
    };
  };

  module LoveQuote {
    public func compare(quote1 : LoveQuote, quote2 : LoveQuote) : Order.Order {
      Text.compare(quote1.id, quote2.id);
    };
  };

  // Persistent data
  let shayariStore = Map.empty<Text, Shayari>();
  let loveQuoteStore = Map.empty<Text, LoveQuote>();
  let photoEntryStore = Map.empty<Text, PhotoEntry>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize with sample data
  do {
    // Initial Shayari
    let initialShayari = [
      (
        "1",
        {
          id = "1";
          title = "Pehli Nazaar";
          body = "Tumhe dekha to yeh jaana sanam,\nPyaar hota hai deewana sanam.";
          order = 1;
        },
      ),
      (
        "2",
        {
          id = "2";
          title = "Ishq Wala Love";
          body = "Ishq wala love hai, koi lafzon ki baat nahi,\nDil se dil tak pohanchti hai yeh khabar.";
          order = 2;
        },
      ),
      (
        "3",
        {
          id = "3";
          title = "Roshan Pyaar";
          body = "Tere pyaar se roshan hai zindagi meri,\nTujh se juda na hona kabhi keh do.";
          order = 3;
        },
      ),
    ];

    // Initial Love Quotes
    let initialLoveQuotes = [
      (
        "1",
        {
          id = "1";
          text = "Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.";
          author = ?"Unknown";
        },
      ),
      (
        "2",
        {
          id = "2";
          text = "In your arms is my favorite place to be.";
          author = ?"Anonymous";
        },
      ),
      (
        "3",
        {
          id = "3";
          text = "Pyaar dosti hai. If she can't be your best friend, then there's no point in falling in love with her.";
          author = ?"Shah Rukh Khan";
        },
      ),
    ];

    initialShayari.forEach(func((id, sh)) { shayariStore.add(id, sh) });
    initialLoveQuotes.forEach(func((id, quote)) { loveQuoteStore.add(id, quote) });
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Shayari CRUD operations (Admin Only)
  public shared ({ caller }) func addShayari(newShayari : Shayari) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add shayari");
    };
    shayariStore.add(newShayari.id, newShayari);
  };

  public shared ({ caller }) func editShayari(updatedShayari : Shayari) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit shayari");
    };
    if (not shayariStore.containsKey(updatedShayari.id)) {
      Runtime.trap("Shayari not found");
    };
    shayariStore.add(updatedShayari.id, updatedShayari);
  };

  public shared ({ caller }) func deleteShayari(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete shayari");
    };
    if (not shayariStore.containsKey(id)) {
      Runtime.trap("Shayari not found");
    };
    shayariStore.remove(id);
  };

  public query func getAllShayari() : async [Shayari] {
    shayariStore.values().toArray().sort();
  };

  public query func getShayariById(id : Text) : async ?Shayari {
    shayariStore.get(id);
  };

  // Love Quotes CRUD operations (Admin Only)
  public shared ({ caller }) func addLoveQuote(newQuote : LoveQuote) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add love quotes");
    };
    loveQuoteStore.add(newQuote.id, newQuote);
  };

  public shared ({ caller }) func editLoveQuote(updatedQuote : LoveQuote) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit love quotes");
    };
    if (not loveQuoteStore.containsKey(updatedQuote.id)) {
      Runtime.trap("Love quote not found");
    };
    loveQuoteStore.add(updatedQuote.id, updatedQuote);
  };

  public shared ({ caller }) func deleteLoveQuote(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete love quotes");
    };
    if (not loveQuoteStore.containsKey(id)) {
      Runtime.trap("Love quote not found");
    };
    loveQuoteStore.remove(id);
  };

  public query func getAllLoveQuotes() : async [LoveQuote] {
    loveQuoteStore.values().toArray();
  };

  public query func getLoveQuoteById(id : Text) : async ?LoveQuote {
    loveQuoteStore.get(id);
  };

  // Photo Entry CRUD operations (Admin Only)
  public shared ({ caller }) func addPhotoEntry(newPhoto : PhotoEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add photos");
    };
    photoEntryStore.add(newPhoto.id, newPhoto);
  };

  public shared ({ caller }) func editPhotoEntry(updatedPhoto : PhotoEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit photos");
    };
    if (not photoEntryStore.containsKey(updatedPhoto.id)) {
      Runtime.trap("Photo entry not found");
    };
    photoEntryStore.add(updatedPhoto.id, updatedPhoto);
  };

  public shared ({ caller }) func deletePhotoEntry(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete photos");
    };
    if (not photoEntryStore.containsKey(id)) {
      Runtime.trap("Photo entry not found");
    };
    photoEntryStore.remove(id);
  };

  public query func getAllPhotoEntries() : async [PhotoEntry] {
    photoEntryStore.values().toArray();
  };

  public query func getPhotoEntryById(id : Text) : async ?PhotoEntry {
    photoEntryStore.get(id);
  };
};
