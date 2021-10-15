import { utils } from "ethers";
import {
  TransactionRequest,
  TransactionResponse
} from "@ethersproject/abstract-provider";
import { Gig, GigFormInput, GigWorkFormat } from "~/interfaces/gig";
import { ERRORS } from "~/constants/ethers.constant";
import { getContract, getContractRw } from "~/services/ethers";
import { GIG_STATUS_MAPPING } from "~/constants/gig-status.constant";

export interface GigsServiceResponse {
  gigsCount: number;
  gigs: Gig[];
}

export async function getGigsService(): Promise<GigsServiceResponse> {
  let gigsCount = 0;
  let gigs = [];

  const localContract = getContract();
  if (!localContract) throw new Error("No contract.");

  gigsCount = parseInt(
    await localContract.gigsCount().catch((error: any) => {
      throw new Error(ERRORS[error.code]);
    })
  );

  if (gigsCount > 0) {
    for (let i = 1; i < gigsCount + 1; i++) {
      const gig = await localContract.gigs(i.toString());

      // get enrolled freelancers
      const enrolled = gig.enrolled;
      let freelancers = [];
      if (enrolled > 0) {
        for (let j = 0; j < enrolled; j++) {
          const freelancer = await localContract
            .enrolledFreelancers(i.toString(), j.toString())
            .catch((error: any) => {
              throw new Error(ERRORS[error.code]);
            });
          freelancers.push(freelancer);
        }
      }

      // get enrolled freelancers submitted works
      const worksNumber = gig.works;
      let works = [];
      if (worksNumber > 0) {
        for (let k = 0; k < worksNumber; k++) {
          const submittedWork = await localContract
            .worksByGig(i.toString(), k.toString())
            .catch((error: any) => {
              console.log(error);
              throw new Error(ERRORS[error.code]);
            });
          works.push(submittedWork.owner);
        }
      }

      // push to array
      gigs.push(formatGig(gig, freelancers, works, i));
    }
  }

  return {
    gigsCount,
    gigs
  };
}

export async function createGigService(
  gig: GigFormInput
): Promise<TransactionResponse> {
  let result;

  const localContractRw = getContractRw();
  if (!localContractRw) throw new Error("No contract.");

  const request: TransactionRequest = {
    value: utils.parseEther(gig.compensation.toString())
  };

  result = await localContractRw
    .createGig(gig.title, gig.freelancers.toString(), request)
    .catch((error: any) => {
      throw new Error(ERRORS[error.code]);
    });

  return result;
}

export async function enrollGigService(
  id: string
): Promise<TransactionResponse> {
  let result;

  const localContractRw = getContractRw();
  if (!localContractRw) throw new Error("No contract.");

  result = await localContractRw.enroll(id.toString()).catch((error: any) => {
    throw new Error(ERRORS[error.code]);
  });

  return result;
}

export async function submitGigService(
  work: GigWorkFormat
): Promise<TransactionResponse> {
  let result;

  const localContractRw = getContractRw();
  if (!localContractRw) throw new Error("No contract.");

  result = await localContractRw
    .submitWork(work.gigId.toString(), work.contract)
    .catch((error: any) => {
      throw new Error(ERRORS[error.code]);
    });
  return result;
}

function formatGig(
  gig: any,
  freelancers: string[],
  works: string[],
  id: number
): Gig {
  return {
    id,
    name: gig.name,
    compensation: gig.compensation.toString(),
    status: GIG_STATUS_MAPPING[gig.status],
    owner: gig.owner,
    freelancersNumber: gig.freelancersNumber,
    freelancers,
    worksSubmitted: gig.works,
    works,
    awardedTo: gig.awardedTo
  };
}
