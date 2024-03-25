import { formatNumber } from "../../utils/numbers";
import jsonDate from "../../utils/jsonDate";
import { stringify } from "querystringify";
import { get } from "../../utils/client";
import { required } from "../../utils/params";
import { baseUrl } from "../../utils/justgiving";

export const fetchDonation = (id = required()) => get(`/v1/donation/${id}`);

export const deserializeDonation = (donation) => ({
  amount: parseFloat(donation.donorLocalAmount || donation.amount),
  anonymous:
    !donation.donorDisplayName ||
    donation.donorDisplayName.toLowerCase().trim() === "anonymous",
  charity: donation.charityId,
  createdAt: jsonDate(donation.donationDate),
  currency: donation.donorLocalCurrencyCode || donation.currencyCode,
  donationRef: donation.donationRef,
  event: donation.eventId,
  message: donation.message,
  name: donation.donorDisplayName,
  page: donation.pageShortName,
  status: donation.status,
  id: donation.id,
});

export const buildDonationUrl = ({
  amount = required(),
  slug,
  id,
  currency = "GBP",
  ...args
}) => {
  const params = stringify({
    amount: formatNumber({ amount }),
    currency,
    ...args,
  });
  if (slug || id) {
    return id
      ? `${baseUrl("link")}/v1/fundraisingpage/donate/pageId/${id}?${params}`
      : `${baseUrl("www")}/fundraising/${slug}/donate?${params}`;
  }
};
