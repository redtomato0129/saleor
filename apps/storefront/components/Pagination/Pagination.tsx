import { useIntl } from "react-intl";

import { PageInfo } from "@/saleor/api";

import { messages } from "../translations";

export interface PaginationProps {
  pageInfo?: PageInfo;
  onLoadMore: () => void;
  totalCount?: number;
  itemsCount?: number;
}

export function Pagination({ pageInfo, onLoadMore, itemsCount, totalCount }: PaginationProps) {
  const t = useIntl();
  if (!pageInfo || !pageInfo?.hasNextPage) {
    return null;
  }

  return (
    <nav className="mt-8 p-4 ">
      <div className="flex justify-center flex-col items-center">
        <button
          type="button"
          onClick={onLoadMore}
          className="relative inline-flex  items-center px-4 py-2 border text-base font-medium rounded-md text-gray-700 bg-gray-50 hover:border-blue-300 cursor-pointer"
        >
          {t.formatMessage(messages.loadMoreButton)}
        </button>
        {itemsCount && totalCount && (
          <div className="text-sm text-gray-500 mt-2">
            {t.formatMessage(messages.paginationProductCounter, {
              totalItemsCount: totalCount,
              currentItemsCount: itemsCount,
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
